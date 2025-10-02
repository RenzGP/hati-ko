import { supabase } from "../lib/supabaseClient";

export async function acceptInvitationsAfterSignup(userId, email) {
  try {
    // 1. Fetch pending invitations
    const { data: invites, error: invitesError } = await supabase
      .from("group_invitations")
      .select("id, group_id")
      .eq("email", email)
      .eq("accepted", false);

    if (invitesError) throw invitesError;
    if (!invites || invites.length === 0) {
      return { success: true, message: "No invitations found." };
    }

    // 2. Add user to groups
    const members = invites.map((invite) => ({
      group_id: invite.group_id,
      user_id: userId,
    }));

    const { error: membersError } = await supabase
      .from("group_members")
      .insert(members);

    if (membersError) throw membersError;

    // 3. Mark invitations as accepted
    const { error: updateError } = await supabase
      .from("group_invitations")
      .update({ accepted: true })
      .in(
        "id",
        invites.map((i) => i.id)
      );

    if (updateError) throw updateError;

    return { success: true, message: "Invitations accepted successfully." };
  } catch (err) {
    console.error("Error accepting invitations:", err.message);
    return { success: false, error: err.message };
  }
}
